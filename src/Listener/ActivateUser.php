<?php

namespace Abdulrehman\SSO\Listener;

use Flarum\User\Event\Registered;

class ActivateUser
{
    final public function handle(Registered $event): void
    {
        $user = $event->user;
        $user->activate();
        $user->save();
    }
}
