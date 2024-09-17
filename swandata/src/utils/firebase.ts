import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // If using Firestore
import { getDatabase,ref,onValue,get,set} from 'firebase/database'; // If using Realtime Database

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDQcNpR73RjnxH_SPQs_MNAnV8mB_Id-Ok",
  authDomain: "swandata-cd40f.firebaseapp.com",
  databaseURL: "https://swandata-cd40f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "swandata-cd40f",
  storageBucket: "swandata-cd40f.appspot.com",
  messagingSenderId: "783167923770",
  appId: "1:783167923770:web:484dfc9b9daab18c753703",
  measurementId: "G-XG0FPG3Z3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app); // If using Realtime Database

export class dbUtils {
  private tableName: string;
  private keyName: string;
  
  constructor(tableName:string,keyName:string){
    this.tableName = tableName;
    this.keyName = keyName;
  }
  fetchData = async () => {
    const snapshot = await get(ref(rtdb, this.tableName));
    const data: any[] = [];
    try {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val() as any;
        childData[this.keyName] = childSnapshot.key;
        data.push(childData);
      });
    } catch(e){
      console.log("Error");
    }
    return data;
  };
  getData = async(id:string) =>{
    const dbRef = ref(rtdb, this.tableName+'/'+id); // Replace 'database' with your database reference
    let snapshot = await get(dbRef)
    if (snapshot.exists()) 
      return snapshot.val()
    else 
        return null
  }   
  saveData = async(id:string, values:any) =>{
    console.log('Data', id,values);

    await set(ref(rtdb, this.tableName+'/' + id), values)
    .then(() => {
      console.log('Data updated successfully with key:', id,values);
    })
    .catch((error) => {
      console.error('Error updating data:', error);
    });
  }

}



