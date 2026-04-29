import app from 'flarum/admin/app';
import { SettingsPage } from './SettingsPage';

app.initializers.add('abdulrehman-sso', () => {
  console.info('ADMIN: App is initialized abdulrehman-sso!!!!!');
  app.registry
    .for('abdulrehman-sso')
    .registerSetting({
      setting: 'abdulrehman-sso.manage_account_btn_open_in_new_tab',
      label: app.translator.trans('abdulrehman-sso.admin.settings.manage_account_btn_open_in_new_tab'),
      type: 'boolean',
    })
    .registerSetting({
      setting: 'abdulrehman-sso.remove_login_btn',
      label: app.translator.trans('abdulrehman-sso.admin.settings.remove_login_btn'),
      type: 'boolean',
    })
    .registerSetting({
      setting: 'abdulrehman-sso.remove_signup_btn',
      label: app.translator.trans('abdulrehman-sso.admin.settings.remove_signup_btn'),
      type: 'boolean',
    })
    .registerPage(SettingsPage);
});
