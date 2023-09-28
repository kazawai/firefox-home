
const command = document.getElementById('title-command');
command.addEventListener('click', () => {
  console.log('clicked');
  const command_input = document.getElementById('command-input');
  command_input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      var searchCommand = command_input.innerText;
      searchCommand.replace(/(<([^>]+)>)/gi, "");
      window.location.href = `https://www.google.com/search?q=${searchCommand}`;
    }
  });
  command_input.focus();
});
