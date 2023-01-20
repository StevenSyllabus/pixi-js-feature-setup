export function triggerEvent(eventName: string) {
  alert(`triggered event: ${eventName}`);
}

export function setState(stateName: string, value: any) {
  const app = document.getElementById(`app`);
  const statesElement = document.getElementById(`states`);
  if (app && statesElement) {
    app.dataset[stateName] = value;

    for (let key in app.dataset) {
      console.log(key + ": " + app.dataset[key]);
      statesElement.innerHTML = `<ol><li>${key}: ${JSON.stringify(
        app?.dataset[key]
      )}</li></ol>`;
    }
  }
}

export function runAction(actionName: string) {
  alert(`triggered action: ${actionName}`);
}
