const formSelector = "#myForm";

const socket = new WebSocket("ws://localhost:3000");

const form = document.querySelector(formSelector);

const getFormValues = () => {
  const formValues = {};

  [...form.elements].forEach((element) => {
    if (element.tagName === "INPUT") {
      formValues[element.name] = element.value;
    }
  });

  return formValues;
};

const populateForm = (formValues) => {
  const values = formValues[window.name];
  const inputs = form.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const name = input.name;

    if (values.hasOwnProperty(name)) {
      input.value = values[name];
    }
  }
};

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.id) {
    window.name = data.id;
  }
  if (data.type === "reload") {
    const formValues = getFormValues();
    socket.send(
      JSON.stringify({
        event: "formValues",
        values: formValues,
        id: window.name,
      })
    );
    location.reload();
  } else if (data.type == "formData") {
    populateForm(data.formValues);
    console.log(data.formValues);
  }
});

window.onload = () => {
  let id;
  if (window.name !== "") {
    id = window.name;
  } else {
    window.name = Date.now().toString();
    id = window.name;
  }
  socket.send(JSON.stringify({ event: "reload", id }));
};
