import mongoose, { Schema, Types } from "mongoose";
interface TodoDocument {
    user: Types.ObjectId;
    title: string;
    description: string;
    status: "not-started" | "in-progress" | "done";
}
declare const Todo: mongoose.Model<TodoDocument, {}, {}, {}, mongoose.Document<unknown, {}, TodoDocument, {}, mongoose.DefaultSchemaOptions> & TodoDocument & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, Schema<TodoDocument, mongoose.Model<TodoDocument, any, any, any, mongoose.Document<unknown, any, TodoDocument, any, {}> & TodoDocument & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, TodoDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<TodoDocument>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<TodoDocument> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default Todo;
//# sourceMappingURL=todoModel.d.ts.map