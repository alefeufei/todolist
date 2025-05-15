document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDueDateInput = document.getElementById('taskDueDateInput'); // Novo campo
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterAllBtn = document.getElementById('filterAll');
    const filterActiveBtn = document.getElementById('filterActive');
    const filterCompletedBtn = document.getElementById('filterCompleted');
    const filterOverdueBtn = document.getElementById('filterOverdue'); // Novo botão
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const now = new Date();

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'overdue') {
                return !task.completed && task.prazoFinal && new Date(task.prazoFinal) < now;
            }
            return true; // 'all'
        });

        if (filteredTasks.length === 0) {
            const li = document.createElement('li');
            li.style.textAlign = 'center';
            li.style.color = '#888';
            if (tasks.length === 0 && currentFilter === 'all') {
                li.textContent = 'Nenhuma tarefa adicionada ainda. Comece adicionando uma!';
            } else if (currentFilter === 'active') {
                li.textContent = 'Nenhuma tarefa ativa.';
            } else if (currentFilter === 'completed') {
                li.textContent = 'Nenhuma tarefa concluída.';
            } else if (currentFilter === 'overdue') {
                li.textContent = 'Nenhuma tarefa atrasada.';
            } else {
                li.textContent = 'Nenhuma tarefa para exibir neste filtro.';
            }
            taskList.appendChild(li);
            return;
        }

        filteredTasks.forEach((task) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);

            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            
            const isOverdue = !task.completed && task.prazoFinal && new Date(task.prazoFinal) < now;
            if (isOverdue) {
                li.classList.add('overdue'); // Classe para estilização de tarefas atrasadas
            }

            const taskContentDiv = document.createElement('div');
            taskContentDiv.className = 'task-content';

            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = task.text;
            taskTextSpan.addEventListener('click', () => toggleTask(originalIndex));
            
            const taskDatesDiv = document.createElement('div');
            taskDatesDiv.className = 'task-dates';
            let datesText = `Criada: ${formatDate(task.criadaEm)}`;
            if (task.prazoFinal) {
                datesText += ` | Prazo: ${formatDate(task.prazoFinal)}`;
            }
            if (task.completed && task.concluidaEm) {
                datesText += ` | Concluída: ${formatDate(task.concluidaEm)}`;
            }
            taskDatesDiv.textContent = datesText;

            taskContentDiv.appendChild(taskTextSpan);
            taskContentDiv.appendChild(taskDatesDiv);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', () => deleteTask(originalIndex));
            
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(taskContentDiv);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
        updateFilterButtons();
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        const dueDate = taskDueDateInput.value; // Captura a data de entrega

        if (taskText === '') {
            alert('Por favor, insira uma tarefa.');
            return;
        }
        tasks.push({ 
            id: Date.now(), 
            text: taskText, 
            completed: false,
            criadaEm: new Date().toISOString(),
            prazoFinal: dueDate ? new Date(dueDate + "T23:59:59").toISOString() : null, // Adiciona hora para considerar o dia todo
            concluidaEm: null
        });
        taskInput.value = '';
        taskDueDateInput.value = ''; // Limpa o campo de data
        saveTasks();
        renderTasks();
    };

    const toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        if (tasks[index].completed) {
            tasks[index].concluidaEm = new Date().toISOString();
        } else {
            tasks[index].concluidaEm = null;
        }
        saveTasks();
        renderTasks();
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    const clearCompleted = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };

    const setFilter = (filter) => {
        currentFilter = filter;
        renderTasks();
    };
    
    const updateFilterButtons = () => {
        filterAllBtn.classList.toggle('active', currentFilter === 'all');
        filterActiveBtn.classList.toggle('active', currentFilter === 'active');
        filterCompletedBtn.classList.toggle('active', currentFilter === 'completed');
        filterOverdueBtn.classList.toggle('active', currentFilter === 'overdue'); // Atualiza o novo botão
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    taskDueDateInput.addEventListener('keypress', (e) => { // Permite adicionar com Enter no campo de data também
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterActiveBtn.addEventListener('click', () => setFilter('active'));
    filterCompletedBtn.addEventListener('click', () => setFilter('completed'));
    filterOverdueBtn.addEventListener('click', () => setFilter('overdue')); // Event listener para o novo filtro
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Renderizar tarefas ao carregar a página
    renderTasks();
});