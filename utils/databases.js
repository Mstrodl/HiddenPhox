module.exports = function(ctx){
    let dbs = {};

    dbs.econ = ctx.db.define('econ', {
        id: {
            type: ctx.libs.sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        currency: {
            type: ctx.libs.sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    });

    dbs.econ.sync();

    return dbs;
}