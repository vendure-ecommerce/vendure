import { cancel, isCancel, outro, select, text } from '@clack/prompts';
import path from 'path';
import { ClassDeclaration, SourceFile } from 'ts-morph';

import { pascalCaseRegex } from '../../../constants';
import { CliCommand } from '../../../shared/cli-command';
import { EntityRef } from '../../../shared/entity-ref';
import { ServiceRef } from '../../../shared/service-ref';
import { analyzeProject, selectEntity, selectPlugin } from '../../../shared/shared-prompts';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { addImportsToFile, createFile, kebabize } from '../../../utilities/ast-utils';

const cancelledMessage = 'Add service cancelled';

interface AddServiceOptions {
    plugin?: VendurePluginRef;
    type: 'basic' | 'entity';
    serviceName: string;
    entityRef?: EntityRef;
}

export const addServiceCommand = new CliCommand<AddServiceOptions, ServiceRef>({
    id: 'add-service',
    category: 'Plugin: Service',
    description: 'Add a new service to a plugin',
    run: options => addService(options),
});

async function addService(providedOptions?: Partial<AddServiceOptions>) {
    const providedVendurePlugin = providedOptions?.plugin;
    const project = await analyzeProject({ providedVendurePlugin, cancelledMessage });
    const vendurePlugin = providedVendurePlugin ?? (await selectPlugin(project, cancelledMessage));

    const type =
        providedOptions?.type ??
        (await select({
            message: 'What type of service would you like to add?',
            options: [
                { value: 'basic', label: 'Basic empty service' },
                { value: 'entity', label: 'Service to perform CRUD operations on an entity' },
            ],
            maxItems: 10,
        }));
    if (isCancel(type)) {
        cancel('Cancelled');
        process.exit(0);
    }
    const options: AddServiceOptions = {
        type: type as AddServiceOptions['type'],
        serviceName: 'MyService',
    };
    if (type === 'entity') {
        const entityRef = await selectEntity(vendurePlugin);
        options.entityRef = entityRef;
        options.serviceName = `${entityRef.name}Service`;
    }

    let serviceSourceFile: SourceFile;
    let serviceClassDeclaration: ClassDeclaration;
    if (options.type === 'basic') {
        serviceSourceFile = createFile(project, path.join(__dirname, 'templates/basic-service.template.ts'));
        const name = await text({
            message: 'What is the name of the new service?',
            initialValue: 'MyService',
            validate: input => {
                if (!input) {
                    return 'The service name cannot be empty';
                }
                if (!pascalCaseRegex.test(input)) {
                    return 'The service name must be in PascalCase, e.g. "MyService"';
                }
            },
        });
        if (isCancel(name)) {
            cancel(cancelledMessage);
            process.exit(0);
        }
        options.serviceName = name;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        serviceClassDeclaration = serviceSourceFile
            .getClass('BasicServiceTemplate')!
            .rename(options.serviceName);
    } else {
        serviceSourceFile = createFile(project, path.join(__dirname, 'templates/entity-service.template.ts'));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        serviceClassDeclaration = serviceSourceFile
            .getClass('EntityServiceTemplate')!
            .rename(options.serviceName);
        const entityRef = options.entityRef;
        if (!entityRef) {
            throw new Error('Entity class not found');
        }
        const templateEntityClass = serviceSourceFile.getClass('TemplateEntity');
        if (templateEntityClass) {
            templateEntityClass.rename(entityRef.name);
            templateEntityClass.remove();
        }
        addImportsToFile(serviceClassDeclaration.getSourceFile(), {
            moduleSpecifier: entityRef.classDeclaration.getSourceFile(),
            namedImports: [entityRef.name],
        });
        const templateTranslationEntityClass = serviceSourceFile.getClass('TemplateEntityTranslation');
        if (entityRef.isTranslatable()) {
            const translationEntityClass = entityRef.getTranslationClass();
            if (translationEntityClass && templateTranslationEntityClass) {
                templateTranslationEntityClass.rename(translationEntityClass?.getName() as string);
                templateTranslationEntityClass.remove();

                addImportsToFile(serviceClassDeclaration.getSourceFile(), {
                    moduleSpecifier: translationEntityClass.getSourceFile(),
                    namedImports: [translationEntityClass.getName() as string],
                });
            }
        } else {
            templateTranslationEntityClass?.remove();
        }
        customizeInputInterfaces(serviceSourceFile, entityRef);
        customizeFindOneMethod(serviceClassDeclaration, entityRef);
        customizeFindAllMethod(serviceClassDeclaration, entityRef);
        customizeCreateMethod(serviceClassDeclaration, entityRef);
        customizeUpdateMethod(serviceClassDeclaration, entityRef);
        removedUnusedConstructorArgs(serviceClassDeclaration, entityRef);
    }

    const serviceFileName = kebabize(options.serviceName).replace(/-service$/, '.service');
    serviceSourceFile?.move(
        path.join(vendurePlugin.getPluginDir().getPath(), 'services', `${serviceFileName}.ts`),
    );

    vendurePlugin.addProvider(options.serviceName);
    addImportsToFile(vendurePlugin.classDeclaration.getSourceFile(), {
        moduleSpecifier: serviceSourceFile,
        namedImports: [options.serviceName],
    });

    serviceSourceFile.organizeImports();
    await project.save();

    if (!providedVendurePlugin) {
        outro('✅  Done!');
    }
    return new ServiceRef(serviceClassDeclaration);
}

function customizeFindOneMethod(serviceClassDeclaration: ClassDeclaration, entityRef: EntityRef) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const findOneMethod = serviceClassDeclaration.getMethod('findOne')!;
    findOneMethod
        .setBodyText(writer => {
            writer.write(` return this.connection
            .getRepository(ctx, ${entityRef.name})
            .findOne({
                where: { id },
                relations,
            })`);
            if (entityRef.isTranslatable()) {
                writer.write(`.then(entity => entity && this.translator.translate(entity, ctx));`);
            } else {
                writer.write(`;`);
            }
        })
        .formatText();
    if (!entityRef.isTranslatable()) {
        findOneMethod.setReturnType(`Promise<${entityRef.name} | null>`);
    }
}

function customizeFindAllMethod(serviceClassDeclaration: ClassDeclaration, entityRef: EntityRef) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const findAllMethod = serviceClassDeclaration.getMethod('findAll')!;
    findAllMethod
        .setBodyText(writer => {
            writer.writeLine(`return this.listQueryBuilder`);
            writer.write(`.build(${entityRef.name}, options,`).block(() => {
                writer.writeLine('relations,');
                writer.writeLine('ctx,');
                writer.writeLine('channelId: ctx.channelId,');
            });
            writer.write(')');
            writer.write('.getManyAndCount()');
            writer.write('.then(([items, totalItems]) =>').block(() => {
                writer.write('return').block(() => {
                    if (entityRef.isTranslatable()) {
                        writer.writeLine('items: items.map(item => this.translator.translate(item, ctx)),');
                    } else {
                        writer.writeLine('items,');
                    }
                    writer.writeLine('totalItems,');
                });
            });
            writer.write(');');
        })
        .formatText();
    if (!entityRef.isTranslatable()) {
        findAllMethod.setReturnType(`Promise<PaginatedList<${entityRef.name}>>`);
    }
}

function customizeCreateMethod(serviceClassDeclaration: ClassDeclaration, entityRef: EntityRef) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const createMethod = serviceClassDeclaration.getMethod('create')!;
    createMethod
        .setBodyText(writer => {
            if (entityRef.isTranslatable()) {
                writer.write(`const newEntity = await this.translatableSaver.create({
                                ctx,
                                input,
                                entityType: ${entityRef.name},
                                translationType: ${entityRef.getTranslationClass()?.getName() as string},
                                beforeSave: async f => {
                                    // Any pre-save logic can go here
                                },
                            });`);
            } else {
                writer.writeLine(
                    `const newEntity = await this.connection.getRepository(ctx, ${entityRef.name}).save(input);`,
                );
            }
            if (entityRef.hasCustomFields()) {
                writer.writeLine(
                    `await this.customFieldRelationService.updateRelations(ctx, ${entityRef.name}, input, newEntity);`,
                );
            }
            writer.writeLine(`return assertFound(this.findOne(ctx, newEntity.id));`);
        })
        .formatText();
    if (!entityRef.isTranslatable()) {
        createMethod.setReturnType(`Promise<${entityRef.name} | null>`);
    }
}

function customizeUpdateMethod(serviceClassDeclaration: ClassDeclaration, entityRef: EntityRef) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updateMethod = serviceClassDeclaration.getMethod('update')!;
    updateMethod
        .setBodyText(writer => {
            if (entityRef.isTranslatable()) {
                writer.write(`const updatedEntity = await this.translatableSaver.update({
                                ctx,
                                input,
                                entityType: ${entityRef.name},
                                translationType: ${entityRef.getTranslationClass()?.getName() as string},
                                beforeSave: async f => {
                                    // Any pre-save logic can go here
                                },
                            });`);
            } else {
                writer.writeLine(
                    `const entity = await this.connection.getEntityOrThrow(ctx, ${entityRef.name}, input.id);`,
                );
                writer.writeLine(`const updatedEntity = patchEntity(entity, input);`);
                writer.writeLine(
                    `await this.connection.getRepository(ctx, ${entityRef.name}).save(updatedEntity, { reload: false });`,
                );
            }
            if (entityRef.hasCustomFields()) {
                writer.writeLine(
                    `await this.customFieldRelationService.updateRelations(ctx, ${entityRef.name}, input, updatedEntity);`,
                );
            }
            writer.writeLine(`return assertFound(this.findOne(ctx, updatedEntity.id));`);
        })
        .formatText();
    if (!entityRef.isTranslatable()) {
        updateMethod.setReturnType(`Promise<${entityRef.name} | null>`);
    }
}

function customizeInputInterfaces(serviceSourceFile: SourceFile, entityRef: EntityRef) {
    const createInputInterface = serviceSourceFile
        .getInterface('CreateEntityInput')
        ?.rename(`Create${entityRef.name}Input`);
    const updateInputInterface = serviceSourceFile
        .getInterface('UpdateEntityInput')
        ?.rename(`Update${entityRef.name}Input`);
    if (!entityRef.hasCustomFields()) {
        createInputInterface?.getProperty('customFields')?.remove();
        updateInputInterface?.getProperty('customFields')?.remove();
    }
    if (entityRef.isTranslatable()) {
        createInputInterface
            ?.getProperty('translations')
            ?.setType(`Array<TranslationInput<${entityRef.name}>>`);
        updateInputInterface
            ?.getProperty('translations')
            ?.setType(`Array<TranslationInput<${entityRef.name}>>`);
    } else {
        createInputInterface?.getProperty('translations')?.remove();
        updateInputInterface?.getProperty('translations')?.remove();
    }
}

function removedUnusedConstructorArgs(serviceClassDeclaration: ClassDeclaration, entityRef: EntityRef) {
    const isTranslatable = entityRef.isTranslatable();
    const hasCustomFields = entityRef.hasCustomFields();
    serviceClassDeclaration.getConstructors().forEach(constructor => {
        constructor.getParameters().forEach(param => {
            const paramName = param.getName();
            if ((paramName === 'translatableSaver' || paramName === 'translator') && !isTranslatable) {
                param.remove();
            }
            if (paramName === 'customFieldRelationService' && !hasCustomFields) {
                param.remove();
            }
        });
    });
}
