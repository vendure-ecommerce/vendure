import ts from 'typescript';

export interface MethodParameterInfo {
    name: string;
    type: string;
}

export interface MemberInfo {
    name: string;
    description: string;
    type: string;
    fullText: string;
}

export interface PropertyInfo extends MemberInfo {
    kind: 'property';
    defaultValue: string;
}

export interface MethodInfo extends MemberInfo {
    kind: 'method';
    parameters: MethodParameterInfo[];
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
    fileName: string;
}

export interface InterfaceInfo extends DeclarationInfo {
    kind: 'interface';
    extends?: string;
    members: Array<PropertyInfo | MethodInfo>;
}

export interface ClassInfo extends DeclarationInfo {
    kind: 'class';
    implements?: string;
    extends?: string;
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

export type ParsedDeclaration = TypeAliasInfo | ClassInfo | InterfaceInfo | EnumInfo | FunctionInfo;
export type ValidDeclaration = ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.ClassDeclaration | ts.EnumDeclaration | ts.FunctionDeclaration;
export type TypeMap = Map<string, string>;
