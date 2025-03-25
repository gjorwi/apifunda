'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SolExoneradoSchema = new Schema({
    exoId: {
        type: String,
        required: [true, 'Id del afiliado']
    },
    exoBenCed: {
        type: String,
        required: [true, 'Id del afiliado']
    },
    exoName: {
        type: String,
        required: [true, 'Nombre de la persona']
    },
    exoLast: {
        type: String,
        required: [true, 'Apellido de la persona']
    },
    exoSex: {
        type: String,
        required: [true, 'Sexo de la persona']
    },
    exoEstCiv: {
        type: String,
        required: [true, 'Estado civil de la persona']
    },
    exoParro: {
        type: String,
        required: [true, 'Parroquia de la persona']
    },
    exoMuni: {
        type: String,
        required: [true, 'Municipio de la persona']
    },
    exoSect: {
        type: String,
        required: [true, 'Sector de la persona']
    },
    exoAddress: {
        type: String
    },
    exoBday:{
        type: Date,
        required: [true, 'Fecha de nacimiento de la persona']
    },
    exoEmail:{
        type: String
    },
    exoCell:{
        type: String
    },
    human:{
        type:Boolean,
        required: [true, 'Tipo de persona']
    },
    exoBenName: {
        type: String,
        required: [true, 'Nombre de la persona beneficiaria']
    },
    exoBenLast: {
        type: String,
        required: [true, 'Apellido de la persona beneficiaria']
    },
    exoBenSex: {
        type: String,
        required: [true, 'Sexo de la persona beneficiaria']
    },
    exoBenEstCiv: {
        type: String,
        required: [true, 'Sstado civil de la persona beneficiaria']
    },
    exoBenBday:{
        type: Date,
        required: [true, 'Fecha de nacimiento de la persona beneficiaria']
    },
    depend: {
        type: String
    },
    parent: {
        type: String
    },
    benSelect: {
        type: String,
        required: [true, 'beneficiario']
    },
    idModPago: {
        type: String,
        required: [true, 'Id de modalidad de pago']
    },
    especName: {
        type: String,
        required: [true, 'Especialidad']
    },
    idServ: {
        type: String,
        required: [true, 'Id de servicio']
    },
    idSubServ: {
        type: String,
        default:null
    },
    reqDocAnex: {
        docCedBen:{
            type: String,
            required: [true, 'Cedula del beneficiario']
        },
        docInfoMed:{
            type: String,
            required: [true, 'Informe medico']
        },
        docOrdMed:{
            type: String,
            required: [true, 'Orden medica']
        }
    },
    other: {
        type: String,
    },
    obs: {
        type: String
    },
    status: {
        type: Boolean,
        default:true
    },
    proceso: {
        type: String,
        default:"pendiente"
    },
    respaprob: {
        type: String,
        default:"En espera de revisión"
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    Updated_date: {
        type: Date,
        default:""
    },
});
module.exports = mongoose.model('SolExonerados', SolExoneradoSchema);