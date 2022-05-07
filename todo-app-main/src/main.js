let sun_moon = document.querySelector(".sun_moon");
let dragSrcEl = null;

sun_moon.addEventListener('click', ()=>{
    const wrapper = document.querySelector(".wrapper")
    wrapper.classList.toggle('light')
    const body = document.querySelector('body')
    body.classList.toggle('light')
    const task_box = document.querySelectorAll('.task_box')
    task_box.forEach(el => {
        el.classList.toggle('light')
    });
    const new_todo = document.querySelector(".new_todo")
    new_todo.classList.toggle('light')
    const menu = document.querySelector('.menu')
    menu.classList.toggle('light')
    sun_moon.classList.toggle('light')
})

window.handleInput = function (value,evn){
    if(evn.key=="Enter" && value.trim().length !== 0){
        createTodo({
            id: Math.floor(Math.random() * 10000) + 1,
            text: value.trim(),
            completed: false,
        })
        evn.target.value = ""
    }
}

function createTodo(todo){
    saveToLocalStorage(todo)
    drawTodo(todo)
}

function saveToLocalStorage(todo){
    localStorage.todo = JSON.stringify([...JSON.parse(localStorage.todo), todo])
}

function drawTodo(todo){
    const task_box = document.querySelector('.task_box')
    const task = document.createElement('div')
    task.dataset.id = todo.id
    task.dataset.completed = todo.completed
    task_box.prepend(task)
    task.classList = 'task'
    task.draggable = true

    task.addEventListener('dragstart', handleDragStart, false)
    task.addEventListener('dragend', handleDragEnd, false)
    task.addEventListener('dragover', handleDragOver, false);
    task.addEventListener('drop', handleDrop, false);

    const complet_toggle = document.createElement('div')
    complet_toggle.classList = 'complet_toggle'
    todo.completed == true ? complet_toggle.classList.add('active') : null
    task.append(complet_toggle)
    complet_toggle.addEventListener('click', changeStatus)

    const todo_text = document.createElement('span')
    todo_text.innerText = todo.text
    task.append(todo_text)

    const img = document.createElement('img')
    img.src = new URL('../images/icon-cross.svg', import.meta.url);
    task.append(img)
    img.addEventListener('click', deleteTodo)
    items_left()
    
}

function handleDragStart(e) {
    this.style.opacity = '0.4';
  
    dragSrcEl = this;
    console.log(this.children[0].classList.value)

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('html', this.children[1].innerText);
    e.dataTransfer.setData('data-id', this.dataset.id);
    e.dataTransfer.setData('data-completed', this.dataset.completed);
    e.dataTransfer.setData('class', this.children[0].classList.value);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function handleDragOver(e) {
   if (e.preventDefault) {
     e.preventDefault();
   }

   return false;
}

function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        dragSrcEl.children[1].innerText = this.children[1].innerText;
        dragSrcEl.dataset.id = this.dataset.id
        dragSrcEl.dataset.completed = this.dataset.completed
        dragSrcEl.children[0].classList = this.children[0].classList.value
        console.log(dragSrcEl)
        this.children[1].innerText = e.dataTransfer.getData('html');
        this.dataset.id = e.dataTransfer.getData('data-id')
        this.dataset.completed = e.dataTransfer.getData('data-completed')
        this.children[0].classList = e.dataTransfer.getData('class')
    }

    return false;
}

function changeStatus(evn){
    let todo_data = evn.target.parentNode.dataset
    const todos = JSON.parse(localStorage.todo)
    todos.map(item => {
        if(item.id == todo_data.id){
            item.completed = !item.completed
        }
    })
    localStorage.todo = JSON.stringify(todos)

    todo_data.completed = !JSON.parse(todo_data.completed)

    evn.target.classList.toggle('active')
}

function deleteTodo(evn){
    const task = evn.target.parentNode;
    evn.target.removeEventListener('click', deleteTodo)
    task.remove()

    let todos = JSON.parse(localStorage.todo)
    todos = todos.filter(item => item.id != task.dataset.id)
    localStorage.todo = JSON.stringify(todos)
    items_left()
}

function makeActive(event){
    const menu_items = document.querySelectorAll(".menu span")
    menu_items.forEach(item => item.classList.remove('active'))
    event.target.classList.add("active")
}

window.showAll = function (event){
    const todos = document.querySelectorAll('.task')
    todos.forEach(item => {
        item.classList.remove('display_none')
    })
    makeActive(event)
}

window.showActive = function (event){
    const todos = document.querySelectorAll('.task')
    todos.forEach(item => {
        if(item.dataset.completed === "true"){
            item.classList.add('display_none')
        }
        else{
            item.classList.remove('display_none')
        }
    })
    makeActive(event);   
}

window.showCompleted = function (event){
    const todos = document.querySelectorAll('.task')
    todos.forEach(item => {
        if(item.dataset.completed === "false"){
            item.classList.add('display_none')
        }
        else{
            item.classList.remove('display_none')
        }
    })
    makeActive(event)
}

window.clearCompleted = function (){
    const todos_el = document.querySelectorAll(".task")
    todos_el.forEach(item => {
        if(item.dataset.completed == "true"){
            item.remove()
        }
    })
    let todos = JSON.parse(localStorage.todo)
    todos = todos.filter(item => item.completed == false)
    localStorage.todo = JSON.stringify(todos)

    items_left()
}

function items_left(){
    const span = document.querySelector(".info span")
    span.innerText = `${JSON.parse(localStorage.todo).length} items left`
}

function init(){
    if(localStorage.todo !== undefined){
        const todos = JSON.parse(localStorage.todo)
        todos.forEach(item => drawTodo(item))
    }
    else{
        localStorage.todo = JSON.stringify([])
    }
}

document.addEventListener("DOMContentLoaded", init())