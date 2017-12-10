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
        cd_steal: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        cd_grace: {
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
    });

    dbs.econ.sync({alter: true});
    dbs.taxbanks.sync({alter: true});

    return dbs;
}