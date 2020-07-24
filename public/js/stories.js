const publish = (id) => {
  const storyId = id.split('-')[1];
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: storyId}),
  };
  fetch('/publish', options)
    .then((res) => res.json())
    .then(({status}) => status && location.replace(`/story/${storyId}`));
};

const main = () => {
  const publishButtons = document.querySelectorAll('.publish-button');
  publishButtons.forEach((button) => {
    button.addEventListener('click', () => publish(button.id));
  });
};

window.onload = main;
