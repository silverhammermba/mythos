require 'fileutils'

map = File.open('types') do |f|
  f.each_line.map do |l|
    l.strip.split
  end
end.to_h

files = Dir.glob('colors/*.jpg').sort

files.each do |f|
  FileUtils.cp(f, "typed/#{File.basename(f, '.jpg')}-#{map[File.basename(f)]}.jpg")
end
