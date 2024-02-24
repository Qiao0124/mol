import os
import json

def txt_to_json(input_directory, output_directory):
    # Iterate through all the txt files in the directory
    for filename in os.listdir(input_directory):
        if filename.endswith('.txt'):
            filepath = os.path.join(input_directory, filename)
            with open(filepath, 'r') as file:
                # Read the contents of the txt file and parse it into a dictionary
                data = {}
                for line in file:
                    key, value = line.strip().split(': ')
                    data[key] = float(value)

            # Converts the parsed dictionary to a JSON string
            json_data = json.dumps(data, indent=4)

            # Save the JSON string to a new file
            output_filepath = os.path.join(output_directory, filename.replace('.txt', '.json'))
            with open(output_filepath, 'w') as output_file:
                output_file.write(json_data)

if __name__ == "__main__":
    input_directory = "./"  # Replace with the directory path containing the txt file
    output_directory = "./"  # Replace with the directory path to save the JSON file
    txt_to_json(input_directory, output_directory)