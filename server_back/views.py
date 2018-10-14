from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json,sys
import Gadget as gadget
import main_entrance


def static_vars(**kwargs):
    def decorate(func):
        for k in kwargs:
            setattr(func, k, kwargs[k])
        return func
    return decorate




counter=0
tags=[]
users=[]
locations=[]




def index(request):
    print(request.META['REMOTE_ADDR'])
    g=gadget.Gadget()
    print('success request')
    # resp=request.GET['x']+'success request'
    return HttpResponse("iccafe"+request.GET['x'])

@csrf_exempt
def calculate(request):
    global counter
    print(request.META['REMOTE_ADDR'])
    counter+=1
    print(counter)
    if request.method == 'POST':
        print(json.loads(request.body))
    data_togo=json.loads(request.body)
    main_entrance.main()
    return HttpResponse("success_iccafe")