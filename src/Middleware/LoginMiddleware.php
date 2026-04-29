<?php

namespace Abdulrehman\SSO\Middleware;

use Flarum\Foundation\Config;
use Flarum\Http\RememberAccessToken;
use Flarum\Http\RequestUtil;
use Flarum\Http\SessionAccessToken;
use Flarum\Http\SessionAuthenticator;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\RedirectResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LoginMiddleware implements MiddlewareInterface
{
    /**
     * @var Config
     */
    private $config;

    /** @var SettingsRepositoryInterface */
    private $settings;

    public function __construct(Config $config, SettingsRepositoryInterface $settings)
    {
        $this->config = $config;
        $this->settings = $settings;
    }

    final public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $session = $request->getAttribute('session');
        $cookies = $request->getCookieParams();
        $prefix = $this->settings->get('abdulrehman-sso.cookies_prefix', 'flarum');

        $tokenValue = Arr::get($cookies, "{$prefix}_token");
        $rememberValue = Arr::get($cookies, "{$prefix}_remember");

        $access_token = $tokenValue ? SessionAccessToken::findValid($tokenValue) : null;
        $remember_token = $rememberValue ? RememberAccessToken::findValid($rememberValue) : null;

        $token = $remember_token ?? $access_token;

        if ($token !== null and $actor->isGuest()) {
            resolve(SessionAuthenticator::class)->logIn($session, $token);
            return new RedirectResponse($this->config->url()->__toString() . $request->getUri()->getPath());
        }

        return $handler->handle($request);
    }
}
