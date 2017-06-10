#!/usr/bin/env ruby

require 'color'
require 'fileutils'

test = [36, 41, 55, 49, 40, 39, 52, 43, 38]

files = Dir.glob('tiles/*.jpg').sort

colors = [60, 120, 240]
names = ["yellow", "green", "blue"]

counts = [0, 0, 0]

files.each do |fname|
  #fname = "tiles/tile-#{num}.jpg"
  dim = `identify #{fname}`[/(\d+x\d+)/, 1].split(?x).map(&:to_i)

  #puts "convert #{fname} -crop x#{(dim[1] * 0.05).to_i}+#{(dim[0] * 0.95).to_i}+0 -colorspace HSL -channel G -evaluate multiply 3 -dither None -colors 2 -format %c -depth 8 histogram:info:-"
  hist = `convert #{fname} -crop x#{(dim[1] * 0.05).to_i}+#{(dim[0] * 0.95).to_i}+0 -colorspace HSL -channel G -evaluate multiply 3 -dither None -colors 2 -format %c -depth 8 histogram:info:-`
  most = hist.lines.sort_by { |line| Integer(line[/(\d+):/, 1], 10) }[-1]
  base = Color::RGB.by_css(most[/#\h{6}/])

  closest = colors.min_by { |c| ((((c - base.to_hsl.hue).abs + 180) % 360) - 180).abs }
  index = colors.index closest

  FileUtils.cp(fname, "colors/#{names[index]}-%02d.jpg" % counts[index])
  counts[index] += 1
end
