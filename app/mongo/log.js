const paginate= require('mongoose-paginate');

module.exports = (app) => {
  const { Schema, connection } = app.mongoose;

  const LogSchema = new Schema({
    id: { type: String },
    uin: { type: String },
    msg: { type: String },
    target: { type: String },
    rowNum: { type: Number },
    colNum: { type: Number },
    level: { type: Number },
    from: { type: String },
    date: { type: Date, default: Date.now },
    ip: { type: String },
    userAgent: { type: String },
  });

  LogSchema.plugin(paginate);

  return connection.model('js_log', LogSchema);
}