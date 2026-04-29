<?php

namespace Abdulrehman\SSO;

use DateTimeZone;
use Flarum\Bus\Dispatcher;
use Flarum\Http\RememberAccessToken;
use Flarum\Http\SessionAccessToken;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\User;
use Illuminate\Database\ConnectionInterface;
use Flarum\Group\Group;
// use Flarum\Install\AdminUser;
use Flarum\User\UserRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Laminas\Diactoros\Response\JsonResponse;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;

class JWTSSOController implements RequestHandlerInterface
{
    /** @var ConnectionInterface */
    private $database;

    /** @var UserRepository */
    private $users;

    /** @var Dispatcher */
    private $bus;

    /** @var string */
    private $site_url;

    /** @var string */
    private $iss;

    /** @var string */
    private $signing_algorithm;

    /** @var string */
    private $signer_key;

    /**
     * @param Dispatcher $bus
     * @param UserRepository $users
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(
        ConnectionInterface $database,
        Dispatcher $bus,
        UserRepository $users,
        SettingsRepositoryInterface $settings

    ) {
        $this->database = $database;
        $this->bus = $bus;
        $this->users = $users;
        $this->site_url = resolve('flarum.config')['url'];
        $this->iss = $settings->get('abdulrehman-sso.jwt_iss');
        $this->signing_algorithm = $settings->get('abdulrehman-sso.jwt_signing_algorithm') ?? 'Sha256';
        $this->signer_key = $settings->get('abdulrehman-sso.jwt_signer_key');
    }

    /**
     * @param Request $request
     * @return ResponseInterface
     *
     * @throws PermissionDeniedException
     *
     * @noinspection RegExpRedundantEscape
     */
    final public function handle(Request $request): ResponseInterface
    {
        // Get token
        $headers = $request->getHeader('Authorization');
        if (empty($headers)) {
            http_response_code(400);
            throw new InvalidArgumentException("No Authorization header was set");
        }

        $header = preg_grep('/^Bearer\s[A-Za-z0-9\-_\=]+\.[A-Za-z0-9\-_\=]+\.?[A-Za-z0-9\-_.+\/\=]*$/', explode(', ', $headers[0]));
        if (empty($header)) {
            http_response_code(400);
            throw new InvalidArgumentException("No JWT found in Authorization headers");
        }

        $jwt = Str::after($header[0], 'Bearer ');
        $signing_algorithm = null;
        switch ($this->signing_algorithm) {
            case 'Sha256':
                $signing_algorithm = 'HS256';
                break;
            case 'Sha384':
                $signing_algorithm = 'HS384';
                break;
            case 'Sha512':
                $signing_algorithm = 'HS512';
                break;
        }

        try {
            $decoded = JWT::decode($jwt, new Key($this->signer_key, $signing_algorithm));
        } catch (\Exception $e) {
            throw new PermissionDeniedException('Invalid token: ' . $e->getMessage());
        }

        // Log issuer 
        error_log($decoded->iss);
        $issuer_this = $this->iss;

        error_log($issuer_this);

        if (empty($decoded->iss) || $decoded->iss !== $this->iss) {
            throw new PermissionDeniedException('Invalid issuer');
        }

        // if (empty($decoded->aud)) {
        //     throw new PermissionDeniedException('Invalid audience');
        // }

        // $aud = is_array($decoded->aud) ? $decoded->aud : [$decoded->aud];
        // if (!in_array($this->site_url, $aud, true)) {
        //     throw new PermissionDeniedException('Invalid audience');
        // }

        $jwt_user = json_decode(json_encode($decoded->user), true);

        // remove any sizing params
        $avatar = Arr::get($jwt_user, 'attributes.avatarUrl');
        $param = '?sz=';
        if (strpos($avatar, $param)) {
            $avatar = substr($avatar, 0, strpos($avatar, $param));
        }

        try {
            $user = $this->users->findOrFail(Arr::get($jwt_user, 'id'));
        } catch (ModelNotFoundException $e) {
            $email = Arr::get($jwt_user, 'attributes.email');
            $username = Arr::get($jwt_user, 'attributes.username');
            $user = $this->users->findByIdentification($email ?? $username);
        }

        if ($user === null) {
            Arr::set($jwt_user, 'attributes.isEmailConfirmed', true);

            $actor = $this->users->findOrFail(1);
            $data = Arr::except($jwt_user, 'id');

            $user = new User();
            $user->username = $username;
            $user->email = $email;
            $user->is_email_confirmed = true;

            $user->save();


            // Need to add check if the user is admin....
            $this->database->table('group_user')->insert([
                'user_id' => $user->id,
                'group_id' => Group::MEMBER_ID,
            ]);

            assert($user instanceof User);
        }

        $user->changeAvatarPath($avatar);
        $user->save();

        $token = $this->getToken($user, true);

        return new JsonResponse([
            'token' => $token,
            'userId' => $user->id
        ]);
    }

    private function getToken(User $user, bool $remember = false): string
    {
        /** @noinspection PhpUnhandledExceptionInspection */
        $token = $remember ? RememberAccessToken::generate($user->id) : SessionAccessToken::generate($user->id);
        $token->save();

        return $token->token;
    }
}
