import pickle

with open('../../public/examples/add_1/tuple.pkl', 'rb') as file:
    loaded_object = pickle.load(file)

print(loaded_object)