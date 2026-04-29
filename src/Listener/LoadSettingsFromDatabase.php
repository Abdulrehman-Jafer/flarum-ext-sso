<?php

namespace Abdulrehman\SSO\Listener;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class LoadSettingsFromDatabase
{
    /** @var SettingsRepositoryInterface */
    //private $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        if ($settings->get('abdulrehman-sso.disable_login_btn')) {
            $settings->set('abdulrehman-sso.remove_login_btn', $settings->get('abdulrehman-sso.disable_login_btn'));
            $settings->set('abdulrehman-sso.remove_signup_btn', 'abdulrehman-sso.disable_signup_btn');
            $settings->delete('abdulrehman-sso.disable_login_btn');
            $settings->delete('abdulrehman-sso.disable_signup_btn');
        }

        if (!$settings->get('abdulrehman-sso.cookies_prefix')) {
            $settings->set('abdulrehman-sso.cookies_prefix', 'flarum');
        }
    }

    final public function subscribe(Dispatcher $events): void
    {

    }
}
