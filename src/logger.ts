import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface ILogSchema {
    lastRequestTime: number;
    totalRequestServed: number;
}
const LogSchema = new Schema<ILogSchema>({
    lastRequestTime: { type: Number, required: true, min: 0},
    totalRequestServed: { type: Number, required: true, min: 0}
})

const LogModel = mongoose.model<ILogSchema>('Logger', LogSchema, 'statistics');

async function logRequest(time: number) {
    LogModel.findOne({}, {}, {}, (err, doc) => {
        if(err) {
            console.log('Failed to logger document!');
        } else {
            doc.lastRequestTime =time;
            doc.totalRequestServed = doc.totalRequestServed + 1;
            doc.save().then((value) => {
                if(value) { console.log('Logged request!')}
            }).catch(error => {
                console.log('Error occured' + error.message);
            });

        }
    })


}

export { logRequest };