<?php

namespace Abdulrehman\SSO\Listener;

use Flarum\User\AvatarUploader;
use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;
use Intervention\Image\ImageManager;

class UserUpdated
{
    final public function handle(Saving $event): void
    {
        $user = $event->user;
        $avatar_url = Arr::get($event->data, 'attributes.avatarUrl');

        if (!empty($avatar_url)) {
            $image = (new ImageManager())->make($avatar_url);
            resolve(AvatarUploader::class)->upload($user, $image);
        }
    }
}
