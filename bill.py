import pickle
import numpy as np
from igraph import *
import pylab as plt
from scipy import stats

T = pickle.load(open('amazon_tree.pkl'))

topics  = []
redness = []
ci      = []
std     = []
deep    = []

def traverse(node, depth):
    if T.vs[node]['kb']+T.vs[node]['kr']==0:  # if this node does have the data
        return

    topics.append(T.vs[node]['label']+(depth-1)*'..')
    deep.append(depth)
    redness.append(T.vs[node]['color'][0])
    ci.append(T.vs[node]['color'][0]-T.vs[node]['ci'][0])
    std.append(T.vs[node]['std'])
    
    for u in T.neighbors(node,OUT):
        traverse(u,depth+1)

traverse(0, 0)

## Plot
x = redness

plt.figure(figsize=[12, 350])
plt.subplots_adjust(left=0.4,right=0.99,top=0.99,bottom=0.01)

plt.scatter(x, range(len(x)), s=60,
            color=np.vstack([x, np.zeros(len(x)), 1-np.array(x)]).T)
plt.errorbar(x, range(len(x)),
             xerr=ci, linestyle='None', ecolor='gray')
plt.plot([0.7685359659184008, 0.7685359659184008],
         [0, len(x)-1], 'k--')

for i in xrange(len(x)):
    if deep[i]==1:
        plt.text(0, i, topics[i], ha='right',
                 va='center', weight='bold', fontsize=10)
    else:
        plt.text(0, i, topics[i], ha='right', va='center', fontsize=10)

plt.yticks(range(len(x)), [])
plt.xlim([0, 1])
plt.ylim([-1, len(x)])
plt.gca().invert_yaxis()

plt.savefig('scale.png')
plt.close()
