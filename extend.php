<?php

use Flarum\Extend;
use Flarum\User\Event\Deleted;
use Flarum\User\Event\LoggedIn;
use Flarum\User\Event\LoggedOut;
use Flarum\User\Event\Registered;
use Flarum\User\Event\Saving;
use Abdulrehman\SSO\JWTSSOController;
use Abdulrehman\SSO\Listener\ActivateUser;
use Abdulrehman\SSO\Listener\AddLogoutRedirect;
use Abdulrehman\SSO\Listener\LoadSettingsFromDatabase;
use Abdulrehman\SSO\Listener\ProviderModeListener;
use Abdulrehman\SSO\Listener\UserUpdated;
use Abdulrehman\SSO\Middleware\LoginMiddleware;
use Abdulrehman\SSO\Middleware\LogoutMiddleware;

return [
    // Frontend extenders (JS)
    (new Extend\Frontend('forum'))->js(__DIR__ . '/js/dist/forum.js'),
    (new Extend\Frontend('admin'))->js(__DIR__ . '/js/dist/admin.js'),

    // Locales
    new Extend\Locales(__DIR__ . '/locale'),

    // Events
    (new Extend\Event())
        ->listen(Registered::class, ActivateUser::class)
        ->listen(LoggedOut::class, AddLogoutRedirect::class)
        ->listen(Saving::class, UserUpdated::class)
        ->subscribe(ProviderModeListener::class)
        ->subscribe(LoadSettingsFromDatabase::class),

    // Middleware
    (new Extend\Middleware('forum'))
        ->add(LoginMiddleware::class)
        ->add(LogoutMiddleware::class),

    // Routes
    (new Extend\Routes('api'))->get('/sso/jwt', 'abdulrehman.jwt-auth', JWTSSOController::class),

    // Settings
    (new Extend\Settings())
        ->serializeToForum('abdulrehman-sso.signup_url', 'abdulrehman-sso.signup_url')
        ->serializeToForum('abdulrehman-sso.login_url', 'abdulrehman-sso.login_url')
        ->serializeToForum('abdulrehman-sso.logout_url', 'abdulrehman-sso.logout_url')
        ->serializeToForum('abdulrehman-sso.manage_account_url', 'abdulrehman-sso.manage_account_url')
        ->serializeToForum('abdulrehman-sso.manage_account_btn_open_in_new_tab', 'abdulrehman-sso.manage_account_btn_open_in_new_tab')
        ->serializeToForum('abdulrehman-sso.remove_login_btn', 'abdulrehman-sso.remove_login_btn')
        ->serializeToForum('abdulrehman-sso.remove_signup_btn', 'abdulrehman-sso.remove_signup_btn')
        ->serializeToForum('abdulrehman-sso.provider_mode', 'abdulrehman-sso.provider_mode')
];
