import jwt
from jwt import PyJWKClient
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import os
from users.models import User

jwk_client = PyJWKClient(os.getenv("JWKS_URL"))


class CognitoJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]
        try:
            signing_key = jwk_client.get_signing_key_from_jwt(token).key

            payload = jwt.decode(
                token,
                key=signing_key,
                algorithms=["RS256"],
                issuer=os.getenv("COGNITO_ISSUER"),
                options={"verify_exp": True},
            )

            try:
                username = (
                    payload.get("username")
                    or payload.get("cognito:username")
                    or payload.get("sub")
                )
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                raise exceptions.AuthenticationFailed("User not found")

            return (user, None)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token is expired")
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f"Invalid token: {str(e)}")
