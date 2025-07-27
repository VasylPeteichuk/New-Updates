const ADMIN_PASSWORD = 'adminpeteichukvasyl'; // пароль адміна, можна змінити

    const authForm = document.getElementById('authForm');
    const authName = document.getElementById('authName');
    const authEmail = document.getElementById('authEmail');

    const adminForm = document.getElementById('adminForm');
    const adminPasswordInput = document.getElementById('adminPassword');

    const authSection = document.getElementById('authSection');
    const userInfo = document.getElementById('userInfo');
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const adminLabel = document.getElementById('adminLabel');
    const logoutBtn = document.getElementById('logoutBtn');
    const clearCommentsBtn = document.getElementById('clearCommentsBtn');

    const commentForm = document.getElementById('commentForm');
    const commentTextInput = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');

    let savedEmail = localStorage.getItem('ccw_email') || null;
    let savedName = localStorage.getItem('ccw_name') || null;
    let isAdmin = localStorage.getItem('ccw_isAdmin') === 'true';
    let comments = JSON.parse(localStorage.getItem('ccw_comments')) || [];

    function saveComments(){
      localStorage.setItem('ccw_comments', JSON.stringify(comments));
    }

    function formatDateTime(dateStr) {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth()+1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    function renderComments(){
      commentsList.innerHTML = '';
      comments.forEach((comment, i) => {
        const isOwnComment = comment.email === savedEmail;
        const canEdit = !isAdmin && isOwnComment;
        const canDelete = isAdmin || isOwnComment;

        const commentDiv = document.createElement('div');
        commentDiv.className = 'ccw-comment' + (comment.isAdmin ? ' admin' : '');

        if(comment.isEditing){
          if(!canEdit){
            commentDiv.textContent = comment.text;
          } else {
            commentDiv.innerHTML = `
              <textarea class="ccw-edit-textarea">${comment.text}</textarea>
              <div class="ccw-edit-actions">
                <button class="ccw-save-btn">Зберегти</button>
                <button class="ccw-cancel-btn">Скасувати</button>
              </div>`;
            const textarea = commentDiv.querySelector('textarea');
            commentDiv.querySelector('.ccw-save-btn').onclick = () => {
              const newText = textarea.value.trim();
              if(newText){
                comments[i].text = newText;
                comments[i].isEditing = false;
                saveComments();
                renderComments();
              } else {
                alert('Коментар не може бути порожнім');
              }
            };
            commentDiv.querySelector('.ccw-cancel-btn').onclick = () => {
              comments[i].isEditing = false;
              renderComments();
            };
          }
        } else {
          commentDiv.innerHTML = `
            <div class="ccw-comment-header">
              <div>
                <span class="ccw-comment-author">${comment.name}${comment.isAdmin ? ' [ADMIN]' : ''}</span>
                <span class="ccw-comment-date">${formatDateTime(comment.date)}</span>
              </div>
              <div class="ccw-comment-buttons">${
                (canEdit ? '<button class="ccw-edit-btn">Редагувати</button>' : '') +
                (canDelete ? '<button class="ccw-delete-btn">Видалити</button>' : '')
              }</div>
            </div>
            <div class="ccw-comment-text">${comment.text.replace(/\n/g, '<br>')}</div>`;

          if(canEdit){
            commentDiv.querySelector('.ccw-edit-btn').onclick = () => {
              comments[i].isEditing = true;
              renderComments();
            };
          }
          if(canDelete){
            commentDiv.querySelector('.ccw-delete-btn').onclick = () => {
              if(confirm('Видалити цей коментар?')){
                comments.splice(i,1);
                saveComments();
                renderComments();
              }
            };
          }
        }
        commentsList.appendChild(commentDiv);
      });
    }

    function validateEmail(email){
      return /\S+@\S+\.\S+/.test(email);
    }

    function startSession(name, email, admin=false){
      savedName = name;
      savedEmail = email;
      isAdmin = admin;
      localStorage.setItem('ccw_name', name);
      localStorage.setItem('ccw_email', email);
      localStorage.setItem('ccw_isAdmin', admin ? 'true' : 'false');

      authSection.style.display = 'none';
      userInfo.style.display = 'flex';
      displayName.textContent = admin ? 'Адміністратор' : name;
      displayEmail.textContent = admin ? '' : ` (${email})`;
      adminLabel.textContent = admin ? '[ADMIN]' : '';
      commentForm.style.display = admin ? 'none' : 'block';
      clearCommentsBtn.style.display = admin ? 'inline-block' : 'none';

      renderComments();
    }

    function logout(){
      localStorage.removeItem('ccw_name');
      localStorage.removeItem('ccw_email');
      localStorage.removeItem('ccw_isAdmin');
      savedName = null;
      savedEmail = null;
      isAdmin = false;
      authSection.style.display = 'block';
      userInfo.style.display = 'none';
      commentForm.style.display = 'none';
      clearCommentsBtn.style.display = 'none';
      commentsList.innerHTML = '';
      authName.value = '';
      authEmail.value = '';
      adminPasswordInput.value = '';
    }

    if(savedName && savedEmail){
      startSession(savedName, savedEmail, isAdmin);
    }

    authForm.onsubmit = e => {
      e.preventDefault();
      const name = authName.value.trim();
      const email = authEmail.value.trim();
      if(!name){
        alert('Введіть ім’я');
        return;
      }
      if(!validateEmail(email)){
        alert('Введіть коректний email');
        return;
      }
      startSession(name, email, false);
    };

    adminForm.onsubmit = e => {
      e.preventDefault();
      const pwd = adminPasswordInput.value;
      if(pwd === ADMIN_PASSWORD){
        startSession('Адміністратор', '', true);
      } else {
        alert('Невірний пароль адміністратора');
      }
    };

    commentForm.onsubmit = e => {
      e.preventDefault();
      const text = commentTextInput.value.trim();
      if(!text) {
        alert('Коментар не може бути порожнім');
        return;
      }
      comments.push({ 
        email: savedEmail, 
        name: savedName, 
        text, 
        isEditing: false,
        isAdmin: false,
        date: new Date().toISOString() 
      });
      saveComments();
      commentTextInput.value = '';
      renderComments();
    };

    logoutBtn.onclick = () => {
      logout();
    };

    clearCommentsBtn.onclick = () => {
      if(confirm('Ви дійсно хочете видалити всі коментарі?')) {
        comments = [];
        saveComments();
        renderComments();
      }
    };

    renderComments();