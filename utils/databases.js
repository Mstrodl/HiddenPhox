module.exports = function(ctx){
    let dbs = {};

    dbs.econ = ctx.db.define("econ", {
        id: {
            type: ctx.libs.sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        currency: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        noreact: {
            type: ctx.libs.sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        lastdaily: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        points: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 3,
            allowNull: false,
        },
        cd_jail: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        cd_grace: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        cd_regen: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        cd_heist: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    });

    dbs.taxbanks = ctx.db.define("taxbanks", {
        id: {
            type: ctx.libs.sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        currency: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        cooldown: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    });

    dbs.sdata = ctx.db.define("sdata", {
        id: {
            type: ctx.libs.sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        roleme: {
            type: ctx.libs.sequelize.STRING,
            defaultValue: "[]",
            allowNull: false,
        },
        logging: {
            type: ctx.libs.sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        allow_snipe: {
            type: ctx.libs.sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    });

    dbs.econ.sync({alter: true});
    dbs.taxbanks.sync({alter: true});
    dbs.sdata.sync({alter:true});

    return dbs;
}