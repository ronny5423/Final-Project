import sys
from bs4 import BeautifulSoup

def loadHtml(path):
    with open(path) as fp:
        return BeautifulSoup(fp, 'html.parser')
    
def addSubdomainToHref(soup, sub):
    for link in soup.find_all('link'):
        link['href'] = '/' + sub + link['href']
    for script in soup.find_all('script'):
        if 'src' in script.attrs and '/static/js' in script['src']:
            script['src'] = '/' + sub + script['src']
    
def saveFixHtml(path, soup):
    with open(path, "wb") as f_output:
        f_output.write(soup.prettify("utf-8"))
        

if len(sys.argv) < 2:
    print('Must receive subdomain url.')
    sys.exit()
    
soup = loadHtml("static/index.html")
addSubdomainToHref(soup, sys.argv[1])
saveFixHtml('static/index.html', soup)
