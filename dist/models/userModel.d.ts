import mongoose, { Schema, Types } from "mongoose";
export interface UserDocument {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}, mongoose.DefaultSchemaOptions> & UserDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, Schema<UserDocument, mongoose.Model<UserDocument, any, any, any, mongoose.Document<unknown, any, UserDocument, any, {}> & UserDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<UserDocument>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<UserDocument> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=userModel.d.ts.map