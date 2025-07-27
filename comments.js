const authForm = document.getElementById('authForm');
    const authName = document.getElementById('authName');
    const authEmail = document.getElementById('authEmail');

    const authSection = document.getElementById('authSection');
    const userInfo = document.getElementById('userInfo');
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    const commentForm = document.getElementById('commentForm');
    const commentTextInput = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');

    let savedEmail = localStorage.getItem('ccw_email') || null;
    let savedName = localStorage.getItem('ccw_name') || null;
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
        const canEdit = comment.email === savedEmail;
        const canDelete = comment.email === savedEmail;

        const commentDiv = document.createElement('div');
        commentDiv.className = 'ccw-comment';
        // Не додаємо клас user-comment
        // if(comment.email === savedEmail){
        //   commentDiv.classList.add('user-comment');
        // }

        if(comment.isEditing){
          if(!canEdit){
            commentDiv.innerHTML = `<div>${comment.text}</div>`;
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
                <span class="ccw-comment-author">${comment.name}</span>
                <span class="ccw-comment-date">${formatDateTime(comment.date)}</span>
              </div>
              <div class="ccw-comment-buttons">${
                (canEdit ? '<button class="ccw-edit-btn" type="button">Редагувати</button>' : '') +
                (canDelete ? '<button class="ccw-delete-btn" type="button">Видалити</button>' : '')
              }</div>
            </div>
            <div class="ccw-comment-text">${comment.text}</div>`;

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

    function startSession(name, email){
      savedName = name;
      savedEmail = email;
      localStorage.setItem('ccw_name', name);
      localStorage.setItem('ccw_email', email);

      authSection.style.display = 'none';
      userInfo.style.display = 'flex';
      displayName.textContent = name;
      displayEmail.textContent = ` (${email})`;
      commentForm.style.display = 'block';

      renderComments();
    }

    function logout(){
      localStorage.removeItem('ccw_name');
      localStorage.removeItem('ccw_email');
      savedName = null;
      savedEmail = null;
      authSection.style.display = 'block';
      userInfo.style.display = 'none';
      commentForm.style.display = 'none';
      commentsList.innerHTML = '';
      authName.value = '';
      authEmail.value = '';
    }

    if(savedName && savedEmail){
      startSession(savedName, savedEmail);
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
      startSession(name, email);
    };

    commentForm.onsubmit = e => {
      e.preventDefault();
      const text = commentTextInput.value.trim();
      if(!text) return;
      comments.push({ 
        email: savedEmail, 
        name: savedName, 
        text, 
        isEditing: false,
        date: new Date().toISOString() 
      });
      saveComments();
      commentTextInput.value = '';
      renderComments();
    };

    logoutBtn.onclick = () => {
      logout();
    };

    renderComments();