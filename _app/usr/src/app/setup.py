import io

from setuptools import find_packages
from setuptools import setup

setup(
    name="blockstream",
    version="1.0.0",
    license="BSD",
    maintainer="speakerbox",
    maintainer_email="joshuawrose@gmail.com",
    description="Blockstream game.",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=["flask"]
)
