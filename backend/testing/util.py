import requests

BASE_URL = 'http://localhost:3001/app'


class RequestHelper:
    """
    Helper class for sending HTTP requests
    """

    def __init__(self) -> None:
        self.session = requests.Session()  # maintain session state
        self.status = 0
        self.json = {}

    def send_request(self, method, endpoint, params=None, data=None, files=None) -> None:
        if endpoint[0] != '/':
            endpoint = '/' + endpoint

        if endpoint[-1] != '/':
            endpoint = endpoint + '/'

        if method == 'POST':
            # if method == POST, send data through in Django request.POST args
            resp = self.session.request(method=method, url=f'{BASE_URL}{endpoint}', params=params, data=data, files=files)

        elif method == 'GET':
            # if method == GET, no body is allowed, so send it through as params
            if params:
                resp = self.session.request(method=method, url=f'{BASE_URL}{endpoint}', params=params)
            else:
                # catch if user accidentally uses data, and send through params instead
                resp = self.session.request(method=method, url=f'{BASE_URL}{endpoint}', params=data)

        else:
            # otherwise send data in Django request.body args
            resp = self.session.request(method=method, url=f'{BASE_URL}{endpoint}', params=params, json=data, files=files)

        self.status = resp.status_code
        self.json = resp.json()
