import ts, { HeritageClause } from 'typescript';

export interface MethodParameterInfo {
    name: string;
    type: string;
    optional: boolean;
    initializer?: string;
}

export interface MemberInfo {
    name: string;
    description: string;
    type: string;
    fullText: string;
    modifiers: string[];
    since: string | undefined;
    experimental: boolean;
}

export interface PropertyInfo extends MemberInfo {
    kind: 'property';
    defaultValue: string;
}

export interface MethodInfo extends MemberInfo {
    kind: 'method';
    parameters: MethodParameterInfo[];
}

export interface DocsPage {
    title: string;
    category: string[];
    declarations: ParsedDeclaration[];
    fileName: string;
}

export interface DeclarationInfo {
    packageName: string;
    sourceFile: string;
    sourceLine: number;
    title: string;
    fullText: string;
    weight: number;
    category: string;
    description: string;
    page: string | undefined;
    since: string | undefined;
    experimental: boolean;
}

export interface InterfaceInfo extends DeclarationInfo {
    kind: 'interface';
    extendsClause: HeritageClause | undefined;
    members: Array<PropertyInfo | MethodInfo>;
}

export interface ClassInfo extends DeclarationInfo {
    kind: 'class';
    extendsClause: HeritageClause | undefined;
    implementsClause: HeritageClause | undefined;
    members: Array<PropertyInfo | MethodInfo>;
}

export interface TypeAliasInfo extends DeclarationInfo {
    kind: 'typeAlias';
    members?: Array<PropertyInfo | MethodInfo>;
    type: ts.TypeNode;
}

export interface EnumInfo extends DeclarationInfo {
    kind: 'enum';
    members: PropertyInfo[];
}

export interface FunctionInfo extends DeclarationInfo {
    kind: 'function';
    parameters: MethodParameterInfo[];
    type?: ts.TypeNode;
}

export interface VariableInfo extends DeclarationInfo {
    kind: 'variable';
}

export type ParsedDeclaration =
    | TypeAliasInfo
    | ClassInfo
    | InterfaceInfo
    | EnumInfo
    | FunctionInfo
    | VariableInfo;
export type ValidDeclaration =
    | ts.InterfaceDeclaration
    | ts.TypeAliasDeclaration
    | ts.ClassDeclaration
    | ts.EnumDeclaration
    | ts.FunctionDeclaration
    | ts.VariableStatement;
export type TypeMap = Map<string, string>;
