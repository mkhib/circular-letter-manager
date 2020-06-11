import mongoose from 'mongoose';

export const clearAllSessions = () => {
    mongoose.connection.db.collection('sessions', (error, collection) => {
        if (error) {
            console.error('Problem in retrieving sessions!');
            return false;
        } else {
            collection.deleteMany({}, (error) => {
                if (error) {
                    console.error('Problem in removing sessions!');
                    return false;
                } else {
                    console.log('All sessions are destroyed');
                }
            })
        }
    });

    return true;
}