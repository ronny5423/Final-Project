def test_successful_login(client, setup_auth_tests):
    response = client.post("/auth/Login", json=setup_auth_tests)

    assert response.status_code == 200


def test_failed_login_no_credentials_supplied(client, setup_auth_tests):
    response = client.post("/auth/Login")

    assert response.status_code == 400


def test_failed_login_incorrect_credentials(client):
    credentials = {"Username": "not existing username",
                   "password": "some random password"}
    response = client.post("/auth/Login", json=credentials)

    assert response.status_code == 401


def test_successful_signup(client, setup_auth_tests):
    credentials = {"Username": "testing signup user",
                   "Password": "12345"}

    response = client.post("/auth/Signup", json=credentials)

    assert response.status_code == 200


def test_failed_signup_no_credentials_supplied(client, setup_auth_tests):
    response = client.post("/auth/Signup")

    assert response.status_code == 400


def test_failed_username_already_exists_signup(client, setup_auth_tests):
    credentials = {"Username": "test_user",
                   "password": "12345"}
    response = client.post("/auth/Signup", json=credentials)

    client.post("/auth/Signup", json=credentials)

    assert response.status_code == 409


def test_successful_logout(client, setup_auth_tests):
    login_response = client.post("/auth/Login", json=setup_auth_tests)
    assert login_response.status_code == 200

    logout_response = client.post("/auth/Logout")
    assert logout_response.status_code == 200


def test_failed_logout_for_not_logged_in_user(client):
    login_response = client.post("/auth/Login")
    assert login_response.status_code == 400

    logout_response = client.post("/auth/Logout")
    assert logout_response.status_code == 401


def test_failed_logout_without_login(client):
    response = client.post("/auth/Logout")

    assert response.status_code == 401
