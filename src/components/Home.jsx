import { useEffect, useState } from "react";
import axios from "axios";
// import { deleteTodo } from "../../../backend/controllers/todo.controller";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [todos, setTodos] = useState([]); // initially keep empty array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const navigate = useNavigate()
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://backend-tasquee.vercel.app/api/v1/todo/fetch",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setTodos(response.data.todos);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch todos");
      } finally {
        setLoading(false); // always stop loading
      }
    };
    fetchTodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "https://backend-tasquee.vercel.app/api/v1/todo/create",
        {
          text: newTodo,
          completed: false,
        },
        {
          withCredentials: true,
          headers: {
              "Content-Type": "application/json",
            },
        }
      );
      setTodos([...todos, response.data.newTodo]);
      setNewTodo("");
    } catch (error) {
      console.error(error);
      setError("Failed to create todos");
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const response = await axios.put(
        `https://backend-tasquee.vercel.app/api/v1/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        {
          withCredentials: true,
          headers: {
              "Content-Type": "application/json",
            },
        }
      );
     
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      console.error(error);
      setError("Failed to fetch todos");
    } finally {
      setLoading(false); // always stop loading
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`https://backend-tasquee.vercel.app/api/v1/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
      setError("Failed to delete todos");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  const logout = async () => {
    try {
       await axios.get("https://backend-tasquee.vercel.app/api/v1/user/logout", {
        withCredentials: true,
      })
      toast.success("User logged out successfully")
      navigate("/login")
      localStorage.removeItem("jwt")
     
    } catch (error) {
      console.log("Error")
    }
  }


  return (
    <div
      className="my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6"
      id="container"
    >
      <h1 className="text-2xl font-semibold text-center">Tasque App</h1>

      <div className="flex py-4">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && todoCreate()}
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
        />
        <button
          className="bg-sky-400 border rounded-r-md text-white px-4 py-2 hover:bg-sky-600 duration-300"
          onClick={todoCreate}
        >
          Add
        </button>
      </div>
      {loading ? (
        <div className="text-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center justify-center text-red-600 font-semibold">{error}</div>
      ) : (
        <ul className="space-y">
          {todos.map((todo, index) => (
            <li
              key={todo._id || index}
              className="flex items-center justify-between p-3 bg-gray-200 rounded-md mb-4"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo._id)}
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-800 font-semibold"
                      : ""
                  } `}
                >
                  {todo.text}
                </span>
              </div>
              <button
                className="text-red-500 font-semibold hover:text-red-800"
                onClick={() => todoDelete(todo._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-1xl text-center text-gray-700">
        <span className="bg-green-400 py-2 px-3 rounded-lg font-semibold  text-white">{remainingTodos}</span> Todo Remaining
      </p>
      <button 
      onClick={() => logout()}
      className="flex items-center mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-300 mx-auto ">
        Logout
      </button>
    </div>
  );
};

export default Home;
