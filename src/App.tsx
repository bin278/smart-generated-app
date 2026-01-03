```javascript
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Edit2, 
  X, 
  Moon, 
  Sun,
  Tag,
  Filter
} from 'lucide-react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['work', 'personal', 'shopping', 'health']);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [todos, darkMode]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      category: selectedCategory === 'all' ? 'personal' : selectedCategory,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const addCategory = () => {
    if (newCategory.trim() === '' || categories.includes(newCategory.toLowerCase())) return;
    setCategories([...categories, newCategory.toLowerCase()]);
    setNewCategory('');
  };

  const filteredTodos = selectedCategory === 'all' 
    ? todos 
    : todos.filter(todo => todo.category === selectedCategory);

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Todo List</h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {pendingCount} pending, {completedCount} completed
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="Add a new task..."
                  className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                />
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Filter size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full transition-colors capitalize ${selectedCategory === category ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredTodos.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No tasks found. Add a new task to get started!
                  </div>
                ) : (
                  filteredTodos.map(todo => (
                    <div
                      key={todo.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed ? 'bg-green-500 border-green-500' : darkMode ? 'border-gray-500' : 'border-gray-400'}`}
                        >
                          {todo.completed && <Check size={14} className="text-white" />}
                        </button>
                        
                        {editingId === todo.id ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                              className={`flex-1 px-3 py-1 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white border'}`}
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <span className={`${todo.completed ? 'line-through opacity-60' : ''}`}>
                                {todo.text}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Tag size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                  {todo.category}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {editingId !== todo.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(todo)}
                            className={`p-2 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-300'}`}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className={`p-2 rounded ${darkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h2 className="text-xl font-bold mb-6">Categories</h2>
            
            <div className="space-y-4 mb-6">
              {categories.map(category => (
                <div
                  key={category}
                  className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category === 'work' ? 'bg-blue-500' : category === 'personal' ? 'bg-purple-500' : category === 'shopping' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="capitalize">{category}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    {todos.filter(t => t.category === category).length}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-700">
              <h3 className="font-medium mb-3">Add New Category</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="Category name"
                  className={`flex-1 px-3 py-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border'}`}
                />
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h3 className="font-bold mb-2">Tips</h3>
              <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Click on a task to mark it complete</li>
                <li>• Filter tasks by category</li>
                <li>• Press Enter to add tasks quickly</li>
                <li>• Tasks are saved automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
```