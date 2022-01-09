"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.CarResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var __1 = require("../../..");
var CarResolver = /** @class */ (function () {
    function CarResolver() {
    }
    CarResolver.prototype.cars = function (ctx, args) {
        return [];
    };
    __decorate([
        graphql_1.Query(),
        __param(0, __1.Ctx()),
        __param(1, graphql_1.Args())
    ], CarResolver.prototype, "cars");
    CarResolver = __decorate([
        graphql_1.Resolver('Car')
    ], CarResolver);
    return CarResolver;
}());
exports.CarResolver = CarResolver;
