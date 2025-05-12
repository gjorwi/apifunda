'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ExoneradoSchema = new Schema({
    exoId: {
        type: String,
        required: [true, 'Id del afiliado']
    },
    idperdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats',
        required: [true, 'Dependencia']
    },
    idperdatsBen: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats',
        required: [true, 'Dependencia']
    },
    depend: {
        type: String,
        default:''
    },
    parent: {
        type: String,
        default:''
    },
    benSelect: {
        type: String,
        required: [true, 'beneficiario']
    },
    idModPago: {
        type: mongoose.Schema.ObjectId,
        ref: 'Modalidades',
        required: [true, 'id de modalidad de pago']
    },
    idServ: {
        type: mongoose.Schema.ObjectId,
        ref: 'Servicios',
        required: [true, 'id de servicio']
    },
    idSubServ: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subservicios',
        default:null
    },
    reqDocAnex: {
        docCedBen:{
            type: String,
            required: [true, 'Cedula beneficiario']
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
        default:''
    },
    identificador: {
        type: String,
        default:'EXONERADO'
    },
    obs: {
        type: String,
        default:''
    },
    proceso: {
        type: String,
        default:"aprobado"
    },
    respaprob: {
        type: String,
        default:"Fue aprobado"
    },
    idUserDatsCreate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        default:null
    },
    idUserDatsUpdate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        default:null
    },
    status: {
        type: Boolean,
        default:true
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
module.exports = mongoose.model('Exonerados', ExoneradoSchema);