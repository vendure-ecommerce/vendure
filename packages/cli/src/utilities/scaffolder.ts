import * as fs from 'fs-extra';
import path from 'path';

export class Scaffolder<TemplateContext = Record<string, any>> {
    private files: Array<{ render: (context: TemplateContext) => string; path: string }> = [];

    addFile(render: (context: TemplateContext) => string, filePath: string) {
        this.files.push({ render, path: filePath });
    }

    createScaffold(options: { dir: string; context: TemplateContext }) {
        fs.ensureDirSync(options.dir);
        this.files.forEach(file => {
            const filePath = path.join(options.dir, file.path);
            const rendered = file.render(options.context).trim();
            fs.ensureFileSync(filePath);
            fs.writeFileSync(filePath, rendered);
        });
    }
}
