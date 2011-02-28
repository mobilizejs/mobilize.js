#!/usr/bin/python
"""

    Ad hoc Python script for making a mobilize.js release.
    
    TODO: Add real minifying
    
    TODO: Run .js files through version line replacement
    
    Usage:
    
        release.py [version tag]
        
    
    Example::
    
        release.py trunk 
        
    Use version tag trunk for running tests. 

"""

import os
import shutil
import sys

# Define different user usabble clouad service bundles
bundles = [
    {
        "name" : "core",
        "bootstrap_js" : ["mobilize.js"],
        "mobile_js" : ["jquery.js", "mobilize.onjq.js", "jquery.mobile.js"],
        "mobile_css" : ["jquery.mobile.css"],        
        "templates" : ["core.html"],
    },

    {
        "name" : "wordpress",
        "bootstrap_js" : ["mobilize.js", "mobilize.wordpress.js"],
        "mobile_js" : ["jquery.js", "mobilize.onjq.js", "jquery.mobile.js"],
        "mobile_css" : ["jquery.mobile.css", "wordpress.css"],        
        "templates" : ["wordpress.html"]
    },

]

version = None

global target_path

home = os.getcwd()

def create_paths():

    global target_path
    
    target_path = os.path.join(home, "releases", version)
    
    if not os.path.exists(target_path):
        os.makedirs(target_path)
        for subpath in ["js", "css", "templates", "images"]:
            os.makedirs(os.path.join(target_path, subpath))
    
def add_extra_extension(filepath, extra_ext):
    """
    Add .min or .debug to filename extension
    """
    root, ext = os.path.splitext(filepath) 
    ext = ext[1:] # .js -> js   
    return ".".join([root, extra_ext, ext])


def create_bundle_core(target, sources, type):
    global version
    
    print "Creating bundle:" + target
    buffer = ""
    for s in sources:
        f = open(os.path.join(home, type, s))
        buffer += f.read()
        f.close()
    
    # Update version
    lines = buffer.split("\n")
    for x in xrange(len(lines)):
        line = lines[x]
        if "$$VERSION_LINE" in line:
            i = line.index('"') + 1
            ie = line.index('"',i)
            line = line[:i] + version + line[ie:]
            lines[x] = line
            
            print "$$VERSION_LINE found. Updated version to '%s'" % version
            break
    buffer = "\n".join(lines)
    
    for mode in ["debug", "min"]:
        output = os.path.join(target_path, type, add_extra_extension(target, mode))    
        f = open(output, "wt")
        f.write(buffer)
        f.close()
        
    
def process_bundle(bundle):    
    """ """

    # Create bootstrap
    create_bundle_core("mobilize.%s.js" % bundle["name"], bundle["bootstrap_js"], "js")    
    create_bundle_core("mobilize.%s.mobile.js" % bundle["name"], bundle["mobile_js"], "js")    
    create_bundle_core("mobilize.%s.mobile.css" % bundle["name"], bundle["mobile_css"], "css")    
    
    # Copy templates
    for t in bundle["templates"]:
        source = os.path.join(home, "templates", t)
        print "Copying template " + source
        target = os.path.join(target_path, "templates")
        shutil.copy(source, target)
    
    
    # Copy images
    

def prepare_images():
    # Image files are shared
    print "Copying images"
    
    images_target = os.path.join(target_path, "css", "images")
    if os.path.exists(os.path.join(images_target)):
        shutil.rmtree(images_target)
    shutil.copytree(os.path.join(home, "css", "images"), images_target)
       
def main():
    
    global version
    
    if len(sys.argv) < 2:
        print "Usage release.py [version tag]"
        sys.exit(1)
        
    version = sys.argv[1] 

    print "mobilize.js release version %s" % version
    create_paths()
    
    # Create bundles and copy bundle specific files
    for b in bundles:
        process_bundle(b)
        
    prepare_images()


if __name__ == "__main__":
    main()
    
    
        