'use client'

import db from "../firebase"
import { addDoc, collection, deleteDoc, getDocs, serverTimestamp, query, orderBy, doc, updateDoc } from "firebase/firestore"
import React , {useState, useEffect} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSnapshot } from 'valtio';
import state from "../store";
import { auth } from '../firebase';
import {signOut} from 'firebase/auth';
import { useRouter } from 'next/navigation';

/* Function to add Todo items in firestore */

const addData = async (data) =>{

    try {
        const docRef = await addDoc(collection(db, "todos"), {
          data: data,
          createdAt: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding todo: ", e);
      }
}

const TodoList = () => {
    
    const snap = useSnapshot(state);
    const router = useRouter();
    const [userName, setUserName] = useState("");

    const [todoData, setTodoData] = useState("");              // todo data
    const [allTodo, setAllTodo] = useState([]);                // all todo list
    const [selectedTodo, setSelectedTodo] = useState(null);    // state for update 
    
    const [isUpdateMode, setIsUpdateMode] = useState(false);  // for button
    
    /* Function to fetch Todo items from Firestore */
    const fetchData = async() =>{
        const todoCollection = collection(db, "todos");
        const querySnapshot = await getDocs(query(todoCollection, orderBy("createdAt")));
        let todosArray = [];
    
        if(querySnapshot ){

            querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
            // console.log(doc.data());
            todosArray.push({id: doc.id, ...doc.data()});
            });
            setAllTodo(todosArray)
        }
        
    }

    /* Function to delete todo items from Firestore */

    const DeleteData = async(todoId)=>{
        try{
            await deleteDoc(doc(db, "todos", todoId));
        }catch(error){
            console.log("Error during deletion - ", error);
        }

        toast.success('Data Deleted Successfully!! ', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

        fetchData();
    }

    const handleSubmit = async() =>{
        if(isUpdateMode){
            if(selectedTodo){
                try{
                    if(todoData){
                        const updatedTodo= {
                            data: todoData,
                            createdAt: serverTimestamp()
                        };
                        console.log("updated todo - "+ updatedTodo);

                        const todoRef = doc(db, "todos", selectedTodo.id);
                        await updateDoc(todoRef, updatedTodo);

                    }else{
                        // alert("Updated Todo item can't be blank.");
                        toast.error('Updated Data cant be blank', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                    }
                    // reset the data in input field
                    setTodoData("");
                    setSelectedTodo(null);
                    setIsUpdateMode(false);

                    toast.success('Todo List Updated Successfully!!', { position: "top-right", autoClose: 5000, hideProgressBar: false,
                        closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light",
                        });

                }catch(err){
                    console.log("Error happened during updation ", err);
                }
            }
        }else{   // in create mode
            if(todoData){
                const added = await addData(todoData);
                setTodoData("");

                toast.success('Data Added Successfully!!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });

            }else{
                // alert("Please Enter Todo item.");
                toast.error('Please Enter Valid Data.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
        }
        fetchData();
    }

    useEffect(()=>{      // to get stored data when component mounts
        
        
        if(snap.user != ""){
            fetchData();
            setUserName(snap.user);
            toast.success(`Welcome ${snap.user}!!`, { position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
                theme: "light",
                });
        }

    },[])

    const handleUpdateClick = (todo)=>{
        setTodoData(todo.data || "");
        setSelectedTodo(todo);
        setIsUpdateMode(true);
    }

    /* Function to handle Sign Out */
    const handleSignOut = () =>{
        signOut(auth).then(()=>{
    
            state.user = "";  //making global state empty
            router.push('/');  //navigating back to home
            
        }).catch((err)=> console.log(err));

    }

  return (
    
    <div className="w-[100vw] h-auto relative back min-h-screen" >

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
         closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

        <div className=" flex items-center justify-end h-[10vh] pr-12 pt-5 max-sm:pr-3 ">
            <button className='px-[2vw] py-[1.5vh] bg-slate-700 rounded mr-3 text-white md:text-base max-sm:text-sm ' onClick={handleSignOut}>Sign Out </button>
        </div>
            <h1 className=" text-center text-2xl font-bold uppercase">Todo App</h1>  
        <div className="w-[100vw] h-[20vh] flex justify-center items-center ">
            <input type="text" value={todoData} placeholder="Add tasks to do" required className="max-sm:h-[40px] max-sm:w-[65%]  border-none outline-none px-3  sm:w-[55%]   lg:w-[25%] sm:h-[43px]  " onChange={(e)=>{ setTodoData(e.target.value);}} />
            <button className=' px-7 py-2.5 text-white rounded bg-slate-700  max-lg:py-2' onClick={handleSubmit} >{isUpdateMode ? <p>Update</p> : <p>Add</p>} </button>
        </div>
        <div className=" mb-14 min-h-[40vh] ">
            {allTodo.length ? allTodo.map((todo)=>{
                return <div key={todo.id} className=" flex mt-4 justify-center min-h-[60px]  ">
                            <div className="md:w-[70%] border flex items-center justify-between rounded-lg max-sm:w-[90%] sm:w-[90%] lg:w-[40%] ">
                                <div className=" max-sm:w-[70%] md:w-[80%] ">
                                    <h1 className=" ml-4 sm:text-lg font-thin max-sm:font-normal">{todo.data}</h1>

                                </div>
                                <div className=" flex"> 
                                    <button className='px-4 py-3  rounded mr-3 text-black max-sm:mr-0 max-sm:px-2 hover:text-white ' onClick={()=>{handleUpdateClick(todo) }}><EditIcon/> </button>
                                    <button className={`px-4 py-3  rounded mr-3 text-black max-sm:mr-1 max-sm:px-2  hover:text-white  ${isUpdateMode?" cursor-not-allowed" : ""}`} disabled={isUpdateMode? true : false} onClick={()=> DeleteData(todo.id)} > <DeleteIcon/> </button>
                                </div>
                            </div>
                    </div>
            }): 
            <div className=" w-[100vw] h-[10vh] flex  items-center justify-center">
                <h1 className=" text-lg  font-normal">No todo items to show !!</h1></div>}
        </div>
    </div>
  )
}

export default TodoList