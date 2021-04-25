#!/bin/bash

ng build --prod --aot
aws s3 cp ./dist/Money-Bunny s3://moneybunny --recursive
