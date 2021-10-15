import random
import string

def slug_generator():
    return (''.join(random.choices(string.ascii_uppercase + string.digits, k=9)))
