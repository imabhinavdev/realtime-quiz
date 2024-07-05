import mongoose,{Schema} from "mongoose";

const QuizSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },

}
);

export const QuizModel = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
