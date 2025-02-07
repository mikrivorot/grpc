## Manage dependencies for 'client' service

See [official documentation](https://docs.astral.sh/uv/getting-started/installation/#upgrading-uv)
and [this Medium post](https://medium.com/@gnetkov/start-using-uv-python-package-manager-for-better-dependency-management-183e7e428760)


```bash
pip install uv
uv init # init repo with python files
```

We have basic files like `pyproject.toml`, `hello.py` and `.python-version` created in the root of the project.

```
uv run hello.py # to create a virtual environment only
```

Activate it:

```bash
source .venv/bin/activate
```

Add all dependencies for FastAPI+gRPC:

```bash
uv add fastapi
uv add uvicorn
uv add grpcio
uv add grpcio-tools
uv add protobuf
```
