#!/bin/bash
# This was necessary to handle Cyclic size limits. When native is included (necessary for windows) the limit is exceeded.
sed -i 's/\"native\"\, //' prisma/schema.prisma