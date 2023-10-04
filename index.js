
const command = document.getElementById('title-command');
const command_input = document.getElementById('command-input');
command_input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && document.activeElement === command_input) {
    var searchCommand = command_input.innerText;
    searchCommand.replace(/(<([^>]+)>)/gi, "");
    window.location.href = `https://www.google.com/search?q=${searchCommand}`;
  }
});

command.addEventListener('click', () => {
  console.log('clicked');
  command_input.focus();
});

window.onload = () => {
  command_input.focus();
}
