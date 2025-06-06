import { el, mount } from 'redom';

export default class App {
  static appCaseCreate() {
    if (!document.getElementById('id-app')) {
      const app = el('div.app', {
        id: 'id-app',
      });

      const body = window.document.body;

      mount(body, app);
    }

    const app = document.getElementById('id-app');
    app.innerHTML = '';
    return app;
  }
}
