'use strict';
module.exports = function (app) {
  
  var multiFunct = require('../functions/exterFunct');//Audit llamaddo
  
  var perdat = require('../controllers/PerdatController');
  /////// Datos Información Routes
  app.route('/')
  .get(perdat.infoDat)
// #####################################################################
  /////// Personas Routes
  app.route('/perdats')
    .put(multiFunct.authenticateJWT,perdat.getPerdat)
    .post(multiFunct.authenticateJWT,perdat.createPerdat);
  app.route('/perdats/:perdatId')
    .post(multiFunct.authenticateJWT,perdat.readPerdat)
    .put(multiFunct.authenticateJWT,perdat.updatePerdat)
    .delete(multiFunct.authenticateJWT,perdat.deletePerdat);
// #####################################################################

  var user = require('../controllers/UserController');
  /////// Usuarios Routes
  app.route('/users')
    .get(multiFunct.authenticateJWT,user.getUser)
    .post(multiFunct.authenticateJWT,user.createUser);
  app.route('/users/:userId')
    .post(multiFunct.authenticateJWT,user.readUser)
    .put(multiFunct.authenticateJWT,user.updateUser)
    .delete(multiFunct.authenticateJWT,user.deleteUser);
// #####################################################################
  var reportes = require('../controllers/ReportController');
  /////// Usuarios Routes
  app.route('/reporte1')
    .put(multiFunct.authenticateJWT,reportes.getReporte1)
  app.route('/reporte2')
    .put(multiFunct.authenticateJWT,reportes.getReporte2)
// #####################################################################

  var afil = require('../controllers/AfilController');
  app.route('/afiliado/:afilId')
    .post(multiFunct.authenticateJWT,afil.readAfil)
    .put(multiFunct.authenticateJWT,afil.updateAfil)
  app.route('/afiliado2/:afilId')
    .post(multiFunct.authenticateJWT,afil.readAfil2)
  // app.route('/afiliadoUpdate/:afilId')
  //   .put(multiFunct.authenticateJWT,afil.updateAfil2)
  app.route('/afiliadotit/:afilId')
    .post(multiFunct.authenticateJWT,afil.readAfilTit)
  app.route('/afilfile')
    .post(multiFunct.authenticateJWT,afil.createAfilFile);
// #####################################################################

  var liq = require('../controllers/LiqController');
  /////// Liquidar Routes
  app.route('/liquidar')
    .post(multiFunct.authenticateJWT,liq.liquidar);
// #####################################################################

  var exo = require('../controllers/ExoneradoController');
  /////// Exonerados Routes
  app.route('/exonerado/:exoId')
    .post(multiFunct.authenticateJWT,exo.readExo)
// #####################################################################

  var solAfil = require('../controllers/SolAfilController');
  /////// Solicitud Afiliados Routes
  app.route('/solafiliado')
    .put(multiFunct.authenticateJWT,solAfil.getSolAfil)
    .post(multiFunct.authenticateJWT,solAfil.createSolAfil);
  app.route('/solafiliado/excel')
    .post(multiFunct.authenticateJWT,solAfil.readSolAfilXlsx);
  app.route('/solafiliado/:solAfilId')
    .post(multiFunct.authenticateJWT,solAfil.readSolAfil)
    .put(multiFunct.authenticateJWT,solAfil.updateSolAfil)
    .delete(multiFunct.authenticateJWT,solAfil.deleteSolAfil);
// #####################################################################

  var solExo = require('../controllers/SolExoController');
  /////// Solicitud Exonerados Routes
  app.route('/solexonerado')
    .put(multiFunct.authenticateJWT,solExo.getSolExo)
    .post(multiFunct.authenticateJWT,solExo.createSolExo);
  app.route('/solexonerado/:solExoId')
    .post(multiFunct.authenticateJWT,solExo.readSolExo)
    .put(multiFunct.authenticateJWT,solExo.updateSolExo)
    .delete(multiFunct.authenticateJWT,solExo.deleteSolExo);
// #####################################################################

  var espec = require('../controllers/EspecController');
  /////// Servicios Routes
  app.route('/especialidad')
    .put(multiFunct.authenticateJWT,espec.getEspec)
    .post(multiFunct.authenticateJWT,espec.createEspec);
  app.route('/especcode')
    .post(multiFunct.authenticateJWT,espec.getCodEspec);
  // app.route('/especialidad/:servId')
  //   // .put(multiFunct.authenticateJWT,serv.selectServ)
  //   .delete(multiFunct.authenticateJWT,espec.deleteServ);
// #####################################################################
  var serv = require('../controllers/ServController');
  /////// Servicios Routes
  app.route('/servicio')
    .put(multiFunct.authenticateJWT,serv.getServ)
    .post(multiFunct.authenticateJWT,serv.createServ);
  app.route('/serviciocode')
    .post(multiFunct.authenticateJWT,serv.getCodServ);
  app.route('/servicio/update/:servCod')
    .put(multiFunct.authenticateJWT,serv.updateServ)
  app.route('/servicio/:servId')
    // .put(multiFunct.authenticateJWT,serv.selectServ)
    .delete(multiFunct.authenticateJWT,serv.deleteServ);
// #####################################################################
  var subserv = require('../controllers/SubServController');
  /////// Servicios Routes
  app.route('/subservicio')
    .put(multiFunct.authenticateJWT,subserv.getSubServ)
    .post(multiFunct.authenticateJWT,subserv.createSubServ);
  app.route('/subserviciocode')
    .post(multiFunct.authenticateJWT,subserv.getCodSubServ);
  app.route('/subservicio/:servId')
    .put(multiFunct.authenticateJWT,subserv.selectSubServ)
    .delete(multiFunct.authenticateJWT,subserv.deleteSubServ);
// #####################################################################
var modpag = require('../controllers/ModpagController');
  app.route('/modpago')
    .put(multiFunct.authenticateJWT,modpag.getMod)
    .post(multiFunct.authenticateJWT,modpag.createMod);

  app.route('/prestall')
    .put(multiFunct.authenticateJWT,modpag.getPrestAll)

  app.route('/modpago/:prestId')
  .post(multiFunct.authenticateJWT,modpag.readPrest)
  // .put(multiFunct.authenticateJWT,prest.updatePrest)
  // .delete(multiFunct.authenticateJWT,prest.deletePrest);
// #####################################################################

  var prest = require('../controllers/PrestController');
  /////// Prestadores Routes
  app.route('/prestador')
    .put(multiFunct.authenticateJWT,prest.getPrest)
    .post(multiFunct.authenticateJWT,prest.createPrest);
  app.route('/prestador/:prestId')
    .post(multiFunct.authenticateJWT,prest.readPrest)
    .put(multiFunct.authenticateJWT,prest.updatePrest)
    .delete(multiFunct.authenticateJWT,prest.deletePrest);
  app.route('/prestadorespec/:especId')
    .post(multiFunct.authenticateJWT,prest.readPrestEspec)
// #####################################################################

  var agenda = require('../controllers/AgendaController');
  /////// Agenda Routes
  app.route('/agenda')
    .put(multiFunct.authenticateJWT,agenda.getAgenda)
    .post(multiFunct.authenticateJWT,agenda.createAgenda);
  app.route('/agendaper')
    .put(multiFunct.authenticateJWT,agenda.getAgendaPer)
  app.route('/agendaservpac/:agendaId')
    .put(multiFunct.authenticateJWT,agenda.getAgendaServPac)
  app.route('/agenda/:agendaId')
    .put(multiFunct.authenticateJWT,agenda.updateAgenda)
    .post(multiFunct.authenticateJWT,agenda.deletePac)
    .delete(multiFunct.authenticateJWT,agenda.deleteAgenda);
  app.route('/agendaper/:agendaId')
    .put(multiFunct.authenticateJWT,agenda.readAgenda)
    .post(multiFunct.authenticateJWT,agenda.updateAgendaPer)
  app.route('/agendater/:agendaId')
    .put(multiFunct.authenticateJWT,agenda.termAgend)
  app.route('/agendavist')
    .put(multiFunct.authenticateJWT,agenda.getAgendaVist)
// #####################################################################

  var checkper = require('../controllers/CheckperController');
  /////// Checkper Routes
  app.route('/checkper')
  app.route('/checkper/:checkperId')
    .post(multiFunct.authenticateJWT,checkper.readcheckper)
// #####################################################################

  var muni = require('../controllers/MuniController');
  /////// Municipios Routes
  app.route('/municipio')
    .put(multiFunct.authenticateJWT,muni.getMuni)
    .post(multiFunct.authenticateJWT,muni.createMuni);
  app.route('/municipiofile')
    .post(multiFunct.authenticateJWT,muni.createMuniFile);
  app.route('/municipio/:muniId')
    .delete(multiFunct.authenticateJWT,muni.deleteMuni);
// #####################################################################
  
  var interv = require('../controllers/IntervController');
  /////// Municipios Routes
  app.route('/interv')
    .put(multiFunct.authenticateJWT,interv.getInterv)
    .post(multiFunct.authenticateJWT,interv.createInterv);
  // app.route('/typeinterv')
  //   .put(multiFunct.authenticateJWT,interv.get);
  app.route('/interv/:intervId')
    .delete(multiFunct.authenticateJWT,interv.deleteInterv);
// #####################################################################

  var parro = require('../controllers/ParroController');
  /////// Parroquias Routes
  app.route('/parroquia')
    .put(multiFunct.authenticateJWT,parro.getParro)
    .post(multiFunct.authenticateJWT,parro.createParro);
  app.route('/parroquiafile')
    .post(multiFunct.authenticateJWT,parro.createParroFile);
  app.route('/parroquia/:parroId')
    .delete(multiFunct.authenticateJWT,parro.deleteParro);
// #####################################################################
  var depend = require('../controllers/DependController');
  /////// Parroquias Routes
  app.route('/dependencia')
    .put(multiFunct.authenticateJWT,depend.getDepend)
    .post(multiFunct.authenticateJWT,depend.createDepend);
  app.route('/dependencia/:dependId')
    .put(multiFunct.authenticateJWT,depend.updateDepend)
    .delete(multiFunct.authenticateJWT,depend.deleteDepend);
// #####################################################################
  var nomina = require('../controllers/NominaController');
  /////// Parroquias Routes
  app.route('/nomina')
    .put(multiFunct.authenticateJWT,nomina.getNomina)
    .post(multiFunct.authenticateJWT,nomina.createNomina);
  app.route('/nomina/:nominaId')
    .delete(multiFunct.authenticateJWT,nomina.deleteNomina);
// #####################################################################

  var check = require('../controllers/CheckController');
  /////// Check root User Routes
  app.route('/ver')
    .put(check.getRootUser)
// #####################################################################

  var access = require('../controllers/AccessController');
  /////// Permisos Routes
  app.route('/access')
    .post(multiFunct.authenticateJWT,access.createAccess);
  app.route('/access/:userId')
    .put(multiFunct.authenticateJWT,access.updateAccess)
// #####################################################################

  var custom = require('../controllers/CustomController');
  /////// Personalizados Routes
  app.route('/listusu')
    // .post(multiFunct.authenticateJWT,custom.userAndDats)
    .put(multiFunct.authenticateJWT,custom.listUsu);
  app.route('/custom/:userId')
    .post(multiFunct.authenticateJWT,custom.userAndDats)
  app.route('/customesearch/:userId')
    .put(multiFunct.authenticateJWT,custom.customSearch)
  app.route('/customchange/:userId')
    .put(multiFunct.authenticateJWT,custom.customChange)
  app.route('/customesearchUsu/:userId')
    .put(multiFunct.authenticateJWT,custom.customSearchUsu)
  app.route('/customuserdats/:userId')
    .post(multiFunct.authenticateJWT,custom.accessAndDats)
  //   .put(multiFunct.authenticateJWT,access.updateUser)
// #####################################################################
    
  var login = require('../controllers/LoginController');
  /////// Login Routes
  app.route('/login')
    .post(login.loginFunct);
// #####################################################################
  
  var logout = require('../controllers/LogoutController');
  /////// Logout Routes
  app.route('/logout')
    .post(logout.logoutFunct);
// #####################################################################
  
  var token = require('../controllers/TokenController');
  /////// Refresh token
  app.route('/token')
    .post(token.refreshToken);
  app.route('/checkToken')
    .post(multiFunct.authenticateJWT,token.checkToken);
// #####################################################################
};