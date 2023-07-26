import os
import json

def txt_to_json(input_directory, output_directory):
    # 遍历目录中的所有txt文件
    for filename in os.listdir(input_directory):
        if filename.endswith('.txt'):
            filepath = os.path.join(input_directory, filename)
            with open(filepath, 'r') as file:
                # 读取txt文件的内容并解析为字典
                data = {}
                for line in file:
                    key, value = line.strip().split(': ')
                    data[key] = float(value)

            # 将解析后的字典转换为JSON字符串
            json_data = json.dumps(data, indent=4)

            # 将JSON字符串保存到新文件中
            output_filepath = os.path.join(output_directory, filename.replace('.txt', '.json'))
            with open(output_filepath, 'w') as output_file:
                output_file.write(json_data)

if __name__ == "__main__":
    input_directory = "./"  # 替换为包含txt文件的目录路径
    output_directory = "./"  # 替换为保存JSON文件的目录路径
    txt_to_json(input_directory, output_directory)